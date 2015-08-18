################################################
# ArcGIS parser micro-service. Parses the output
# of an ArcGIS instance and and returns GeoJSON.
################################################

FROM node:latest

MAINTAINER Luis Capelo <capelo@un.org>

RUN \
  git clone http://github.com/luiscape/hdx-monitor-arcgis-parser \
  && cd hdx-monitor-arcgis-parser \
  && make setup

WORKDIR "/hdx-monitor-arcgis-parser"

CMD ["make","run"]
