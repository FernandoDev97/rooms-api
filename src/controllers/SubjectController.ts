import { Request, Response } from 'express'
import { z } from 'zod'
import { subjectRepository } from '../repositories/subjectRepository'

export class SubjectController {
  async create(req: Request, res: Response) {
    const createSubjectBodySchema = z.object({
      name: z.string(),
    })

    const { name } = createSubjectBodySchema.parse(req.body)

    try {
      const newSubject = subjectRepository.create({
        name,
      })

      await subjectRepository.save(newSubject)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal server error.' })
    }

    return res.status(201).json()
  }
}
