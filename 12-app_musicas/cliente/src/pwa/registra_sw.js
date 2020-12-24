/* eslint-disable no-console */
//@flow

export default () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker?.register('/service-worker.js')
        .then(registro => {
          console.warn('SW registrado: ', registro)
        })
        .catch(erro => {
          console.log('SW registro falhou: ', erro)
        })
    })
  }
}