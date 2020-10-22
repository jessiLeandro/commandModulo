FROM nginx:1.15.2-alpine

ADD . .
LABEL Description="building APP"
RUN yarn install
RUN ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime
RUN yarn build
LABEL Description="APP built"


COPY ./build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]