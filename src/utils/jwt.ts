import { JwtPayload, sign, verify } from 'jsonwebtoken'

const secretKey = process.env.JWT_SECRET_KEY ?? ''

// 만약 파일이 빈 값이면 프로세스 종료하기
if (!secretKey) throw new Error('No JWT secret key')

export function generateJWT<T extends Record<string, unknown>>(payload: T, expiresIn = '3d') {
  return new Promise<string>((resolve, reject) => {
    sign(payload, secretKey, { expiresIn }, (err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token as string)
    })
  })
}

export function verifyJWT<T>(token: string) {
  return new Promise<T & JwtPayload>((resolve, reject) => {
    verify(token, secretKey, { algorithms: ['HS256'] }, (err, decoded) => {
      // JWT가 아니거나, JWT 서명이 유효하지 않거나, JWT 유효기간이 만료됐을 때
      if (err) reject(err)

      resolve(decoded as T & JwtPayload)
    })
  })
}
