// @flow
// funções de manipulação de imagem


import type {ImagemEmBase64, ImagemEmURL} from './tipos'

export type ImagemProcessada = {| imagem: ImagemEmBase64, miniatura: ImagemEmBase64 |}

async function processaImagem(imagemOriginal: ImagemEmBase64): Promise<ImagemProcessada> {
  const imagem = await redimensiona(imagemOriginal, 500)
  const miniatura = await redimensiona(imagemOriginal, 70)
  return {imagem, miniatura}
}

// adaptado de https://gist.github.com/CawaKharkov/1c477d44fcfdf67aea3f
function convertImgToBase64URL(url: ImagemEmURL, cb, cb_erro) {
  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.onload = function() {
    let canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.height = img.height
    canvas.width = img.width
    ctx.drawImage(img, 0, 0)
    const dataURL = canvas.toDataURL()
    canvas = null
    cb(dataURL)
  }
  img.onerror = () => {
    cb_erro(new Error('Endereço não é imagem ou não dá permissão para ler imagem'))
  }
  img.src = url
}

export function converteImagemEmBase64URL (url: ImagemEmURL): Promise<ImagemEmBase64> {
  return new Promise((resolve, reject) => {
    try {
      convertImgToBase64URL(url, (dataURL) => resolve(dataURL), (erro) => reject(erro))      
    } catch (erro) {
      reject(erro)
    }
  })
}

// inspirado em https://codepen.io/andersdn/pen/VKPAgg?editors=1010
function redimensionaImagem(imagem: ImagemEmBase64, maxW: number, cb: ImagemEmBase64 => void): void {
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  const maxH = maxW

  const i = new Image()
  i.onload = () => {
    const iw = i.width
    const ih = i.height
    const escala = Math.min( (maxW/iw), (maxH/ih))
    const iwScala = iw * escala
    const ihScala = ih * escala

    c.width = iwScala
    c.height = ihScala
    ctx.drawImage(i, 0, 0, iwScala, ihScala)
    const novaImagem = c.toDataURL()
    cb(novaImagem)
  }
  i.src = imagem
}

function redimensiona(imagem: ImagemEmBase64, max: number): Promise<ImagemEmBase64> {
  return new Promise(resolve => {
    redimensionaImagem(imagem, max,  (novaImagem) => resolve(novaImagem))
  })
}
export default processaImagem