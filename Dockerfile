FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/nginx:alpine

MAINTAINER ZXD

COPY dist /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
