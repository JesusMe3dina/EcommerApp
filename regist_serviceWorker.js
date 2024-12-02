if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./Service_Worker.js')
      .then(reg => console.log('Registro de Service Worker exitoso:', reg.scope))
      .catch(err => console.warn('Error al registrar el Service Worker:', err));
}
