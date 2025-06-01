import Joi from 'joi';

export const lessonSchema = Joi.object({
  title: Joi.object({
    en: Joi.string().required(),
    tw: Joi.string(),
    ga: Joi.string(),
    ewe: Joi.string()
  }).required(),
  description: Joi.object({
    en: Joi.string().required(),
    tw: Joi.string(),
    ga: Joi.string(),
    ewe: Joi.string()
  }).required(),
  category: Joi.string().required().valid('Business', 'Farming', 'Health'),
  content: Joi.object({
    en: Joi.object({
      audioUrl: Joi.string(),
      videoUrl: Joi.string(),
      text: Joi.string(),
      images: Joi.array().items(Joi.string())
    }).required(),
    tw: Joi.object({
      audioUrl: Joi.string(),
      videoUrl: Joi.string(),
      text: Joi.string(),
      images: Joi.array().items(Joi.string())
    }),
    ga: Joi.object({
      audioUrl: Joi.string(),
      videoUrl: Joi.string(),
      text: Joi.string(),
      images: Joi.array().items(Joi.string())
    }),
    ewe: Joi.object({
      audioUrl: Joi.string(),
      videoUrl: Joi.string(),
      text: Joi.string(),
      images: Joi.array().items(Joi.string())
    })
  }).required(),
  duration: Joi.number().required().min(1),
  difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
  isPublished: Joi.boolean().default(false)
}); 