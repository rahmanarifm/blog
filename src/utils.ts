export async function hold(time: number): Promise<undefined> {
  return new Promise(res => {
    setTimeout(res, time);
  })
}
