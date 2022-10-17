/**
 * Check if the device is a mobile or not
 *
 * @returns {boolean}
 */
export const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|SamsungBrowser/i.test(
    navigator.userAgent
  )
