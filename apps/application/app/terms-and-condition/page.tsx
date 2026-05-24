import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Lazari Ways - Terms and conditions',
    description:
        'Terms and conditions regarding the sharing and processing of personal and employment-related documents with LazariWays and interested employers for employment purposes.',
}

export default function TermsAndCondition() {
    return (
        <main className="flex flex-col gap-2 p-6">
            <span className="text-xl underline">წესები და პირობები</span>
            მე, წინამდებარე დოკუმენტით, უფლებას ვაძლევ LazariWays-ს, გადასცეს
            ჩემ მიერ წარმოდგენილი პირადი დოკუმენტები დაინტერესებულ დამსაქმებლებს
            დასაქმების მიზნით. ვეთანხმები, რომ LazariWays-მ დაინტერესებულ
            დამსაქმებლებს მიაწოდოს ინფორმაცია ჩემი პირადი და ჯანმრთელობასთან
            დაკავშირებული შეზღუდვების შესახებ, რომლებიც გავლენას ახდენს ჩემი
            სამუშაოს შესრულების უნარზე. გარდა ამისა, ვეთანხმები, რომ
            LazariWays-მ შეიძლება ნახოს ჩემი სახელფასო ფურცლები/ანაზღაურების
            დამადასტურებელი დოკუმენტები/შემოსავლის გადასახადის დამადასტურებელი
            ცნობები და ასევე მიიღოს ეს დოკუმენტები.
        </main>
    )
}
