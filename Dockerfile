FROM node

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y --no-install-recommends \
  ghostscript \
  img2pdf \
  liblept5 \
  libsm6 libxext6 libxrender-dev \
  zlib1g \
  pngquant \
  qpdf \
  tesseract-ocr \
  tesseract-ocr-rus \
  tesseract-ocr-eng \
  unpaper \
  python3.4 \
  python3-pip

RUN pip install --upgrade pip
COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY src/backend ./backend
COPY src/front ./front

RUN cd backend && npm install
RUN cd front && npm install && npm run build

CMD [ "node", "backend/index.js" ]

EXPOSE 7777
