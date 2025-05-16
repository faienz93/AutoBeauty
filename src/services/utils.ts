

export const getDateString = () => {
    return new Date().toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}