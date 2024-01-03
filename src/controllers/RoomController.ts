import { Request, Response } from 'express'
import { z } from 'zod'
import { roomRepository } from '../repositories/roomRepository'
import { videoRepository } from '../repositories/videoRepository'

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
}
