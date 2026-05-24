import type { Metadata } from 'next'
import { CropImagePageClient } from './page.client'

export const metadata: Metadata = {
    title: 'ფოტოს ამოჭრა',
    description: 'აირჩიეთ სურათი, მოარგეთ კადრში და ჩამოტვირთეთ.',
}

export default function CropImagePage() {
    return <CropImagePageClient />
}
