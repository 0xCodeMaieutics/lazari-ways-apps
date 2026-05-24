'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { FileUpload } from '@/components/file-upload'
import { Download } from 'lucide-react'
import { ImageCropper } from '../image-cropper'

function downloadFile(file: File) {
    const url = URL.createObjectURL(file)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = file.name
    anchor.click()
    URL.revokeObjectURL(url)
}

function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
    })
}

export function CropImagePageClient() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [base64Image, setBase64Image] = useState<string | null>(null)
    const [croppedFile, setCroppedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl])

    const openCropper = useCallback(
        async (file: File) => {
            setCroppedFile(null)
            setBase64Image(null)
            setPreviewUrl((current) => {
                if (current) URL.revokeObjectURL(current)
                return null
            })
            const dataUrl = await readFileAsDataUrl(file)
            setBase64Image(dataUrl)
        },
        []
    )

    const handleFileChange = useCallback(
        async (file: File | File[] | null) => {
            const nextFile = Array.isArray(file) ? (file[0] ?? null) : file

            setCroppedFile(null)
            setBase64Image(null)
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
                setPreviewUrl(null)
            }

            if (!nextFile) {
                setSelectedFile(null)
                return
            }

            if (!nextFile.type.startsWith('image/')) {
                setSelectedFile(null)
                return
            }

            setSelectedFile(nextFile)
            await openCropper(nextFile)
        },
        [openCropper, previewUrl]
    )

    const handleCropComplete = useCallback((file: File) => {
        setCroppedFile(file)
        setBase64Image(null)
        setPreviewUrl((current) => {
            if (current) URL.revokeObjectURL(current)
            return URL.createObjectURL(file)
        })
        downloadFile(file)
    }, [])

    return (
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                    ფოტოს ამოჭრა
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    აირჩიეთ სურათი, მოარგეთ კადრში და ჩამოტვირთეთ
                    კვადრატული ვერსია.
                </p>
            </div>

            <FileUpload
                accept="image/*"
                value={selectedFile}
                onChange={handleFileChange}
                placeholder="აირჩიეთ სურათი"
            />

            {selectedFile && base64Image === null && !croppedFile && (
                <Button type="button" onClick={() => openCropper(selectedFile)}>
                    ფოტოს მორგება
                </Button>
            )}

            {selectedFile && base64Image !== null && (
                <ImageCropper
                    base64Image={base64Image}
                    originalFile={selectedFile}
                    onDismiss={() => setBase64Image(null)}
                    onCropComplete={handleCropComplete}
                />
            )}

            {croppedFile && previewUrl && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-lg font-medium">ამოჭრილი ფოტო</h2>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={previewUrl}
                            alt="ამოჭრილი ფოტო"
                            className="border-border mx-auto aspect-square w-full max-w-[min(85vw,280px)] rounded-xl border object-cover"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            onClick={() => downloadFile(croppedFile)}
                        >
                            <Download className="size-4" />
                            ჩამოტვირთვა
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => openCropper(selectedFile!)}
                        >
                            თავიდან მორგება
                        </Button>
                    </div>
                </div>
            )}
        </main>
    )
}
