```prisma
model Vacancy {
    id                    String   @id @default(cuid())
    title                 String
    location              String
    duration              String
    salary                String
    jobDescription        String
    schedule              String
    accommodation         String
    meals                 String
    additionalInfo        String?
    photos                String[] // Array of photo URLs
    videos                String[] // Array of video URLs
    createdAt             DateTime @default(now())
    updatedAt             DateTime @updatedAt
    
    reviews               Review[]
}

model Review {
    id          String   @id @default(cuid())
    name        String
    review      String
    instagram   String?
    vacancyId   String
    vacancy     Vacancy  @relation(fields: [vacancyId], references: [id], onDelete: Cascade)
    createdAt   DateTime @default(now())
}
```