import { Request, Response } from 'express'
import AWS from 'aws-sdk'

const route = async (req: Request, res: Response) => {
  const s3AccessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID
  const s3AccessSecret = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  const s3Bucket = process.env.REACT_APP_AWS_BUCKET
  const s3Region = process.env.REACT_APP_AWS_DEFAULT_REGION
  const { fileName, fileType } = req.body
  let response
  let responseCode = 200
  console.log('Route', s3Region, s3Bucket)
  try {
    AWS.config.update({
      region: s3Region
    })
    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: s3AccessKeyId,
        secretAccessKey: s3AccessSecret
      }
    })
    response = await s3.getSignedUrlPromise('putObject', {
      Bucket: s3Bucket,
      Key: fileName,
      ContentType: fileType,
      Expires: 1200 // 20 mins
    })
    console.log('response is', response)
  } catch (e) {
    response = { error: e.message }
    responseCode = 500
  }
  res.status(responseCode).json({ response, fileName, fileType })
}

export default route
