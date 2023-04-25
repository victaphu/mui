import { Request, Response } from 'express'
import axios from 'axios'
import FormData from 'form-data'
import AWS from 'aws-sdk'
import { log } from '../../utils/log'
// import { log } from '../src/utils/log'

const route = async (req: Request, res: Response) => {
  const { key, pinJson, pinFolder } = req.body
  const s3AccessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID
  const s3AccessSecret = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  const s3Bucket = process.env.REACT_APP_AWS_BUCKET
  const s3BucketFixed = process.env.REACT_APP_AWS_BUCKET_FIXED
  const ipfsUploadUrl = pinJson
    ? 'https://api.pinata.cloud/pinning/pinJSONToIPFS'
    : 'https://api.pinata.cloud/pinning/pinFileToIPFS'
  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: s3AccessKeyId,
      secretAccessKey: s3AccessSecret
    }
  })
  let config
  if (!pinJson) {
    const s3Stream = s3
      .getObject({
        Bucket: s3Bucket,
        Key: key
      })
      .createReadStream()
    const form = new FormData()
    form.append('file', s3Stream, key)
    config = {
      method: 'post',
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      url: `${ipfsUploadUrl}`,
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT_SECRET}`,
        ...form.getHeaders()
      },
      data: form
    }
    await axios(config)
      .then((ipfsResponse) => {
        res.status(200).json(ipfsResponse.data)
      })
      .catch((e) => {
        res.status(500).json({ error: e.message })
      })
  } else {
    let s3Stream
    try {
      s3Stream = await s3
        .getObject({
          Bucket: s3BucketFixed,
          Key: pinFolder + '/' + key + '.json'
        })
        .promise()
    } catch (e) {
      console.log('Failed to get object')
      log('mad:pin:s3', e, 'error')
    }
    // if (s3Stream && s3Stream.statusCode != 404) {
    //   res.status(200).json({ error: 'Metadata file already exists for this ID' })
    // } else {
    const s3Put = s3
      .putObject({
        Bucket: s3BucketFixed,
        Key: pinFolder + '/' + key + '.json',
        Body: JSON.stringify(pinJson),
        ContentType: 'application/json'
      })
      .promise()

    s3Put
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((err) => {
        console.log('Failed to get object', pinJson, typeof pinJson, pinFolder, key)
        res.status(500).json({ error: err.message })
      })
    // }
  }
}

export default route
