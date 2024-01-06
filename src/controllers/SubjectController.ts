import { Request, Response } from 'express'
import { z } from 'zod'
import { subjectRepository } from '../repositories/subjectRepository'

export class SubjectController {
  async create(req: Request, res: Response) {
    const createSubjectBodySchema = z.object({
      name: z.string(),
    })

    const { name } = createSubjectBodySchema.parse(req.body)

    const newSubject = subjectRepository.create({
      name,
    })

    await subjectRepository.save(newSubject)

    return res.status(201).json()
  }
}
