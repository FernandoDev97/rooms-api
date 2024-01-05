import { Request, Response } from 'express'
import { tuple, z } from 'zod'
import { roomRepository } from '../repositories/roomRepository'
import { videoRepository } from '../repositories/videoRepository'
import { subjectRepository } from '../repositories/subjectRepository'

export class RoomController {
  async create(req: Request, res: Response) {
    const createRoomBodyScrema = z.object({
      name: z.string(),
      description: z.string().optional(),
    })

    const { name, description } = createRoomBodyScrema.parse(req.body)

    try {
      const newRoom = roomRepository.create({
        name,
        description,
      })

      await roomRepository.save(newRoom)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }

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

    if (!id) {
      return res.status(422).json({ menssage: 'Id da aula incorreto.' })
    }

    const room = await roomRepository.findOne({ where: { id } })

    if (!room) {
      return res.status(404).json({ message: 'Aula nao existe' })
    }

    try {
      const newVideo = videoRepository.create({
        title,
        url,
        room,
      })

      await videoRepository.save(newVideo)
      return res.status(201).json(newVideo)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
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

    try {
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
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }

  async list(_req: Request, res: Response) {
    try {
      const rooms = await roomRepository.find({
        relations: {
          subjects: true,
        },
      })

      return res.status(200).json(rooms)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }
}
