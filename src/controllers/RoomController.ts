import { Request, Response } from 'express'
import { z } from 'zod'
import { roomRepository } from '../repositories/roomRepository'
import { videoRepository } from '../repositories/videoRepository'
import { subjectRepository } from '../repositories/subjectRepository'
import { ApiError, NotFoundError } from '../helpers/api-erros'

export class RoomController {
  async create(req: Request, res: Response) {
    const createRoomBodyScrema = z.object({
      name: z.string(),
      description: z.string().optional(),
    })

    const { name, description } = createRoomBodyScrema.parse(req.body)

    const newRoom = roomRepository.create({
      name,
      description,
    })

    await roomRepository.save(newRoom)

    return res.status(201).json()
  }

  async createVideo(req: Request, res: Response) {
    const videoBodyScrema = z.object({
      title: z.string(),
      url: z.string(),
    })

    const videoParamsSchema = z.object({
      id: z.string(),
    })

    const { title, url } = videoBodyScrema.parse(req.body)
    const { id } = videoParamsSchema.parse(req.params)

    const room = await roomRepository.findOne({ where: { id } })

    if (!room) {
      throw new NotFoundError('Aula nao existe')
    }

    const newVideo = videoRepository.create({
      title,
      url,
      room,
    })

    await videoRepository.save(newVideo)
    return res.status(201).json(newVideo)
  }

  async roomSubject(req: Request, res: Response) {
    const videoBodyScrema = z.object({
      subjectId: z.string(),
    })

    const videoParamsSchema = z.object({
      idRoom: z.string(),
    })

    const { subjectId } = videoBodyScrema.parse(req.body)
    const { idRoom } = videoParamsSchema.parse(req.params)

    const room = await roomRepository.findOne({ where: { id: idRoom } })

    if (!room) {
      return res.status(404).json({ message: 'Aula nao existe' })
    }

    const subject = await subjectRepository.findOne({
      where: { id: subjectId },
    })

    if (!subject) {
      return res.status(404).json({ message: 'Disciplina nao existe' })
    }

    const roomUpdate = {
      ...room,
      subjects: [subject],
    }

    await roomRepository.save(roomUpdate)

    return res.status(200).json(room)
  }

  async list(_req: Request, res: Response) {
    const rooms = await roomRepository.find({
      relations: {
        subjects: true,
      },
    })

    return res.status(200).json(rooms)
  }
}
