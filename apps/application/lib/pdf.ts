import { PDFDocument, PDFFont, rgb, StandardFonts } from 'pdf-lib'
import { ApplicationFormData } from './application-form-schema'

export const generateApplicationPdf = async (
    applicationFormData: ApplicationFormData & {
        logo: File
    }
) => {
    const pdfDoc = await PDFDocument.create()
    const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

    const colors = {
        accent: rgb(0.85, 0.31, 0.27),
        label: rgb(0.32, 0.34, 0.38),
        body: rgb(0.06, 0.07, 0.09),
        rule: rgb(0, 0, 0),
    }

    const margin = 48
    const labelColumn = 200
    const bodySize = 12
    const lineGap = 3
    const sectionGapBefore = 10

    const sectionTitleSize = 16
    const applicationNameSize = 15

    let page = pdfDoc.addPage()
    let { width, height } = page.getSize()
    let cursorY = height - margin

    const advance = (dy: number) => {
        cursorY -= dy
    }

    const newPage = () => {
        page = pdfDoc.addPage()
        width = page.getSize().width
        height = page.getSize().height
        cursorY = height - margin
    }

    const ensureVerticalSpace = (minHeight: number) => {
        if (cursorY - minHeight < margin) {
            newPage()
        }
    }

    const accentH = 7
    if (accentH > 0) {
        page.drawRectangle({
            x: 0,
            y: height - accentH,
            width,
            height: accentH,
            color: colors.accent,
        })
    }
    cursorY -= accentH + 35

    const photoBytes = new Uint8Array(
        await applicationFormData.foto.arrayBuffer()
    )

    const embeddedPhoto =
        applicationFormData.foto.type === 'image/png'
            ? await pdfDoc.embedPng(photoBytes)
            : await pdfDoc.embedJpg(photoBytes)

    const maxPhotoW = 108
    const maxPhotoH = 132
    const photoScale = Math.min(
        maxPhotoW / embeddedPhoto.width,
        maxPhotoH / embeddedPhoto.height,
        1
    )
    const photoW = embeddedPhoto.width * photoScale
    const photoH = embeddedPhoto.height * photoScale

    const photoBottomY = cursorY - 50
    page.drawImage(embeddedPhoto, {
        x: margin,
        y: photoBottomY,
        width: photoW,
        height: photoH,
    })

    const logoBaseline = cursorY - 20

    const embeddedLogo = await pdfDoc.embedPng(
        new Uint8Array(await applicationFormData.logo.arrayBuffer())
    )

    const logoScale = 0.2
    const logoWidth = embeddedLogo.width * logoScale
    const logoHeight = embeddedLogo.height * logoScale

    page.drawImage(embeddedLogo, {
        x: width - margin - logoWidth,
        y: logoBaseline,
        width: logoWidth,
        height: logoHeight,
    })

    cursorY = Math.min(photoBottomY - 16, logoBaseline - 44)

    page.drawRectangle({
        x: margin,
        y: cursorY,
        width: width - margin * 2,
        height: 0.9,
        color: colors.rule,
    })
    cursorY -= 14

    page.drawText(
        `${applicationFormData.firstName} ${applicationFormData.lastName}`,
        {
            x: margin,
            y: cursorY,
            size: applicationNameSize,
            font: fontBold,
            color: colors.body,
        }
    )

    cursorY -= 26

    const formatOptional = (v: string | undefined) => {
        const t = typeof v === 'string' ? v.trim() : ''
        return t.length > 0 ? t : '—'
    }

    const formatGender = (g: ApplicationFormData['gender']) =>
        g === 'M' ? 'Männlich' : 'Weiblich'

    const formatDate = (isoDate: string | undefined) => {
        const t = typeof isoDate === 'string' ? isoDate.trim() : ''
        if (t.length === 0) return '—'

        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t)
        if (!match) return t

        const [, year, month, day] = match
        const date = new Date(Number(year), Number(month) - 1, Number(day))
        if (Number.isNaN(date.getTime())) return t

        return new Intl.DateTimeFormat('de-DE', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date)
    }

    const formatBool = (v: boolean | undefined) => {
        if (v === undefined) return '—'
        return v ? 'Ja' : 'Nein'
    }

    type Row = readonly [label: string, value: string]

    const lineHeight = bodySize + lineGap

    const drawKv = (label: string, value: string) => {
        const valueMaxWidth = width - margin * 2 - labelColumn - 8

        const parts = value
            .replace(/\r\n/g, '\n')
            .split('\n')
            .map((p) => p.trimEnd())
            .filter((p) => p.trim().length > 0)

        const wrappedLines = parts.flatMap((p) =>
            pdfWrapLines(p, fontRegular, bodySize, valueMaxWidth)
        )
        const displayLines = wrappedLines.length > 0 ? wrappedLines : ['—']

        ensureVerticalSpace(displayLines.length * lineHeight + bodySize)

        page.drawText(label, {
            x: margin,
            y: cursorY,
            size: bodySize,
            font: fontBold,
            color: colors.label,
        })

        let lineBaseline = cursorY
        for (const lineText of displayLines) {
            page.drawText(lineText, {
                x: margin + labelColumn,
                y: lineBaseline,
                size: bodySize,
                font: fontRegular,
                color: colors.body,
            })
            lineBaseline -= lineHeight
        }

        cursorY = lineBaseline - 8
    }

    const drawSection = (title: string, rows: Row[]) => {
        ensureVerticalSpace(sectionGapBefore + sectionTitleSize + 18)

        advance(sectionGapBefore)

        page.drawText(title, {
            x: margin,
            y: cursorY,
            size: sectionTitleSize,
            font: fontBold,
            color: colors.accent,
        })
        cursorY -= sectionTitleSize + 4

        page.drawRectangle({
            x: margin,
            y: cursorY,
            width: 140,
            height: 1,
            color: colors.accent,
        })
        cursorY -= 12

        for (const [label, value] of rows) {
            drawKv(label, value)
        }
    }

    drawSection('Persönliche Angaben', [
        ['Vorname', formatOptional(applicationFormData.firstName)],
        ['Nachname', formatOptional(applicationFormData.lastName)],
        ['Geschlecht', formatGender(applicationFormData.gender)],
        ['Geburtsdatum', formatDate(applicationFormData.birthDate)],
        ['Geburtsort', formatOptional(applicationFormData.birthPlace)],
        ['Geburtsland', formatOptional(applicationFormData.birthCountry)],
    ])

    drawSection('Adresse', [
        ['Straße', formatOptional(applicationFormData.street)],
        ['Postleitzahl', formatOptional(applicationFormData.postalCode)],
        ['Stadt', formatOptional(applicationFormData.city)],
        ['Land', formatOptional(applicationFormData.country)],
    ])

    drawSection('Kontakt & soziale Medien', [
        ['E-Mail', formatOptional(applicationFormData.email)],
        ['Telefon', formatOptional(applicationFormData.phone)],
        ['Instagram', formatOptional(applicationFormData.instagram)],
        ['Steuer-ID', formatOptional(applicationFormData.taxId)],
    ])

    const formattedSemesterFrom = formatDate(
        applicationFormData.semesterBreakFrom
    )
    const formattedSemesterTo = formatDate(applicationFormData.semesterBreakTo)
    const semesterBreak =
        formattedSemesterFrom === '—' && formattedSemesterTo === '—'
            ? '—'
            : `${formattedSemesterFrom} - ${formattedSemesterTo}`

    drawSection('Studium', [
        ['Universität', formatOptional(applicationFormData.university)],
        ['Studienfach', formatOptional(applicationFormData.studySubject)],
        ['Semesterferien (von - bis)', semesterBreak],
    ])

    drawSection('Fähigkeiten & Eignung', [
        ['Deutschkenntnisse', formatOptional(applicationFormData.germanLevel)],
        [
            'Weitere Sprachen',
            formatOptional(applicationFormData.otherLanguages),
        ],
        ['Führerschein', formatOptional(applicationFormData.driverLicense)],
        ['Kann Fahrrad fahren', formatBool(applicationFormData.canRideBike)],
        [
            'Bereitschaft zur Schichtarbeit',
            formatBool(applicationFormData.shiftWork),
        ],
        [
            'Gesundheitliche Einschränkungen',
            formatOptional(applicationFormData.healthRestrictions),
        ],
        ['Allergien', formatOptional(applicationFormData.allergies)],
        ['Kleidergröße', formatOptional(applicationFormData.clothingSize)],
        ['Schuhgröße', formatOptional(applicationFormData.shoeSize)],
    ])

    const prevPlace = applicationFormData.previousStayPlace?.trim() ?? ''
    const prevFrom = applicationFormData.previousStayPeriodFrom?.trim() ?? ''
    const prevTo = applicationFormData.previousStayPeriodTo?.trim() ?? ''
    const formattedPrevFrom = formatDate(
        applicationFormData.previousStayPeriodFrom
    )
    const formattedPrevTo = formatDate(applicationFormData.previousStayPeriodTo)
    const hasPrevStay = prevPlace !== '' || prevFrom !== '' || prevTo !== ''
    const prevStay = !hasPrevStay
        ? '—'
        : `${prevPlace || '-'} (${formattedPrevFrom} - ${formattedPrevTo})`

    drawSection('Aufenthalt in Deutschland', [
        [
            'Bereits in Deutschland gewesen',
            formatBool(applicationFormData.hasBeenInGermanyBefore),
        ],
        ['Angaben zu früheren Aufenthalten', prevStay],
    ])

    drawSection('Notfallkontakt', [
        ['Name', formatOptional(applicationFormData.emergencyContactName)],
        ['Telefon', formatOptional(applicationFormData.emergencyPhone)],
    ])

    drawSection('Arbeitsbereich', [
        ['Branche', formatOptional(applicationFormData.workSector)],
    ])

    const confirmation =
        'Hiermit bestätige ich die Richtigkeit und Vollständigkeit meiner Angaben.'
    const signatureHint = 'Ort, Datum, Unterschrift'
    const footerTextMaxWidth = width - margin * 2
    const confirmationLines = pdfWrapLines(
        confirmation,
        fontRegular,
        bodySize,
        footerTextMaxWidth
    )

    ensureVerticalSpace(
        sectionGapBefore +
            confirmationLines.length * lineHeight +
            12 +
            14 +
            lineHeight +
            16
    )

    advance(sectionGapBefore)

    let footerBaseline = cursorY - 40
    for (const lineText of confirmationLines) {
        page.drawText(lineText, {
            x: margin,
            y: footerBaseline,
            size: bodySize,
            font: fontRegular,
            color: colors.body,
        })
        footerBaseline -= lineHeight
    }

    cursorY = footerBaseline - 12

    page.drawRectangle({
        x: margin,
        y: cursorY,
        width: width - margin * 2,
        height: 0.9,
        color: colors.rule,
    })
    cursorY -= 14

    page.drawText(signatureHint, {
        x: margin,
        y: cursorY,
        size: bodySize,
        font: fontRegular,
        color: colors.label,
    })
    cursorY -= lineHeight + 8

    return await pdfDoc.save()
}

function pdfWrapLines(
    text: string,
    font: PDFFont,
    fontSize: number,
    maxWidth: number
): string[] {
    const words = text.split(/\s+/).filter(Boolean)
    const lines: string[] = []

    const splitWord = (word: string): string[] => {
        const chunks: string[] = []
        let rest = word
        while (rest.length > 0) {
            if (font.widthOfTextAtSize(rest, fontSize) <= maxWidth) {
                chunks.push(rest)
                break
            }

            let lo = 1
            let hi = rest.length
            let best = 1
            while (lo <= hi) {
                const mid = Math.floor((lo + hi) / 2)
                const measured = font.widthOfTextAtSize(
                    rest.slice(0, mid),
                    fontSize
                )
                if (measured <= maxWidth) {
                    best = mid
                    lo = mid + 1
                } else {
                    hi = mid - 1
                }
            }

            chunks.push(rest.slice(0, best))
            rest = rest.slice(best)
        }
        return chunks
    }

    let currentLine = ''

    const flushCurrentLine = () => {
        const trimmed = currentLine.trimEnd()
        if (trimmed !== '') lines.push(trimmed)
        currentLine = ''
    }

    for (const word of words) {
        const fragments =
            font.widthOfTextAtSize(word, fontSize) <= maxWidth
                ? [word]
                : splitWord(word)

        for (const fragment of fragments) {
            const candidate =
                currentLine === '' ? fragment : `${currentLine} ${fragment}`

            if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
                currentLine = candidate
                continue
            }

            flushCurrentLine()

            if (font.widthOfTextAtSize(fragment, fontSize) <= maxWidth) {
                currentLine = fragment
            } else {
                lines.push(...splitWord(fragment))
                currentLine = ''
            }
        }
    }

    flushCurrentLine()
    return lines
}

// check if the file is directly invoked using tsx
if (require.main === module) {
    void (async function () {
        const fs = await import('fs')
        const util = await import('util')
        const path = await import('path')

        const readFileAsync = util.promisify(fs.readFile)
        const writeFileAsync = util.promisify(fs.writeFile)

        const pngPath = '/Users/gioshara/Desktop/temp/images/Me.png'
        const pngContent = await readFileAsync(pngPath)

        const logoPath = path.join(process.cwd(), './lib/ir-germany-logo.png')
        const logoContent = await readFileAsync(logoPath)

        const pdfBytes = await generateApplicationPdf({
            firstName: 'John',
            lastName: 'Doe',
            gender: 'M',
            birthDate: '1990-01-01',
            birthPlace: 'Berlin',
            birthCountry: 'Germany',
            street: 'Example Street 42',
            postalCode: '10115',
            city: 'Berlin',
            country: 'Germany',
            email: 'john.doe@example.com',
            phone: '+491234567890',
            instagram: 'john_insta',
            taxId: '123456789',
            foto: new File([pngContent], 'me.png', {
                type: 'image/png',
            }),
            logo: new File([logoContent], 'ir.png', {
                type: 'image/png',
            }),
            university: 'Humboldt University',
            studySubject: 'Computer Science',
            semesterBreakFrom: '2024-07-01',
            semesterBreakTo: '2024-09-30',
            germanLevel: 'B2',
            otherLanguages: 'English, Spanish',
            driverLicense: 'B',
            canRideBike: true,
            shiftWork: false,
            healthRestrictions: '',
            allergies: 'Peanuts',
            clothingSize: 'M',
            shoeSize: '42',
            hasBeenInGermanyBefore: true,
            previousStayPlace: 'Munich',
            previousStayPeriodFrom: '2021-05-01',
            previousStayPeriodTo: '2021-09-01',
            emergencyContactName: 'Jane Doe',
            emergencyPhone: '+49111222333',
            workSector: 'Hotel/Gaststätte',
        })
        await writeFileAsync('./application.pdf', pdfBytes)
    })()
}

// Added "Deine Wunsch-Branche" feature -> Hotel/Gaststätte, Systemgastronomie, Landwirtschaft, Gebäude-/Industriereinigung, Industrielle Produktion, Sonstige (möglichst genaue Angaben)
// - Pdf
// - Form UI
// Success page
// ImageCropper does not work properly with landscape fotos. (probs that's fine for now)
