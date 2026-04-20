let capture;
let pg; // 用來建立一個獨立的畫布 (Graphics)

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide(); // 隱藏原本獨立生成的 HTML video 元素
  imageMode(CENTER); // 設定圖片繪製模式為中心點
}

function draw() {
  background('#e7c6ff');

  // 確保攝影機已載入，且 pg 畫布尚未建立
  if (capture.width > 0 && !pg) {
    // 建立一個與攝影機影像原始尺寸相同的畫布
    pg = createGraphics(capture.width, capture.height);
  }

  // 如果 pg 畫布已建立，我們就可以在上面畫東西
  if (pg) {
    const gridSize = 20;
    pg.clear(); // 清除上一個 frame 的內容
    capture.loadPixels(); // 載入攝影機影像的像素資料

    // 確保像素資料已成功載入
    if (capture.pixels.length > 0) {
      pg.fill(255); // 設定文字顏色為白色
      pg.textSize(9); // 設定一個適合顯示在格子中的字體大小
      pg.textAlign(LEFT, TOP);
      pg.noStroke();

      // 以 gridSize 為單位，遍歷整個畫布
      for (let y = 0; y < pg.height; y += gridSize) {
        for (let x = 0; x < pg.width; x += gridSize) {
          // 計算像素在 capture.pixels 陣列中的索引位置
          const index = (y * capture.width + x) * 4;
          // 取得該像素的 R, G, B 值
          const r = capture.pixels[index];
          const g = capture.pixels[index + 1];
          const b = capture.pixels[index + 2];

          // 計算平均亮度值
          const avg = (r + g + b) / 3;

          // 在 pg 畫布的對應位置上顯示平均值
          pg.text(floor(avg), x, y);
        }
      }
    }
  }

  // 為了讓影像看起來像鏡子一樣（左右相反），我們需要水平翻轉畫布
  push(); // 儲存目前的繪圖狀態
  translate(width, 0); // 將(0,0)原點移到畫布的右上角
  scale(-1, 1); // 沿Y軸翻轉X軸 (水平翻轉)
  image(capture, width / 2, height / 2, width * 0.6, height * 0.6); // 繪製攝影機影像
  if (pg) {
    image(pg, width / 2, height / 2, width * 0.6, height * 0.6); // 將 pg 畫布疊在攝影機影像上方
  }
  pop(); // 恢復到原本的繪圖狀態
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
