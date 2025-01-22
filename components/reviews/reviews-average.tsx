
export const getReviewAverage = (reviews: number[]) => {
  return reviews.length === 0 ? 0 : reviews.reduce((acc, curr) => acc + curr, 0) / reviews.length
}
