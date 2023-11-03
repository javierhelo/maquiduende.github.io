import express, { json } from 'express'
import 'dotenv/config.js'

import { createMakeupRouter } from './routes/makeups.js'
import { createMakeupCategoryRouter } from './routes/makeup-categories.js'
import { createKeywordRouter } from './routes/keywords.js'
import { createImageRouter } from './routes/images.js'

import { MakeupModel } from './models/makeups.js'
import { MakeupCategoryModel } from './models/makeup-categories.js'
import { KeywordModel } from './models/keywords.js'

import { corsMiddleware } from './middlewares/cors.js'

const express = require('express');

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')
app.use(express.urlencoded({ extended: false}));
app.use('/maquiduende/makeups', createMakeupRouter({ makeupModel: MakeupModel }))
app.use('/maquiduende/makeup-categories', createMakeupCategoryRouter({ makeupCategoryModel: MakeupCategoryModel }))
app.use('/maquiduende/keywords', createKeywordRouter({ keywordModel: KeywordModel }))
app.use('/maquiduende/images', createImageRouter())

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
