// @ts-ignore
import express, { Request, Response } from 'express';
const app = express();
const port = 3000;

app.get('/slow', (req: Request, res: Response) => {
  res.write('T'); // 最初のデータをすぐに送信

  setTimeout(() => {
    res.end('his is a slow response'); // 残りのデータを遅延して送信
  }, 2000); // 2秒待機
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});