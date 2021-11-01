import { IpServiceService } from './../../../../../services/ip-service/ip-service.service';
import { PrintService } from './../../../../../services/print/print.service';
import { Component, Input, OnInit } from '@angular/core';
import { Map } from 'src/app/modules/ol';
import * as $ from 'jquery';
import domtoimage from 'dom-to-image-more';
import { environment } from 'src/environments/environment';
import { transform } from 'ol/proj';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
})
export class PrintComponent implements OnInit {
  @Input() map: Map | undefined;
  titre = '';
  description = '';
  image;
  layer;

  constructor(
    public printService: PrintService,
    public ipService: IpServiceService,
    public analyticService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.ipService.getIP();
  }

  printMap() {
    $('#loading_print').show();

    $.post(
      environment.url_prefix + 'analytics',
      {
        type: 'draw',
        draw_name: 'print',
        ip: this.ipService.getIP(),
      },
      (data) => {
        // data
      }
    );

    this.analyticService.addAnalytics({
      type: 'tool',
      name: 'print',
      ip: this.ipService.getIP(),
    });

    console.log(this.map?.getViewport());
    console.log(this.map?.getView().calculateExtent(this.map.getSize()));
    console.log(this.map?.getSize());

    var exportOptions = {
      height: 0,
      width: 0,
      filter: function (element) {
        var className = element.className || '';
        return (
          className.indexOf('ol-control') === -1 ||
          className.indexOf('ol-scale') > -1 ||
          (className.indexOf('ol-attribution') > -1 &&
            className.indexOf('ol-uncollapsible'))
        );
      },
    };

    var width = this.map?.getSize()![0];
    var height = this.map?.getSize()![1];

    this.map?.once('rendercomplete', () => {
      exportOptions.width = width!;
      exportOptions.height = height!;
      domtoimage
        .toJpeg(this.map?.getViewport(), exportOptions)
        .then((dataUrl) => {
          this.printModule(dataUrl);
        });
    });

    this.map?.render();
  }

  printModule(url) {
    function getCenterOfExtent(ext) {
      var X = ext[0] + (ext[2] - ext[0]) / 2;
      var Y = ext[1] + (ext[3] - ext[1]) / 2;
      return [X, Y];
    }

    function getmetricscal() {
      var px = $('.ol-scale-line-inner').css('width');

      var numpx = px.replace(/\D+/g, '');
      var distancecarte = +numpx * 0.264583 * 0.1;

      var scale = $('.ol-scale-line-inner').text();
      var numscale = +scale.replace(/\D+/g, '');

      var unit = scale.replace(/[0-9]/g, '');

      if (unit == ' km') {
        numscale = numscale * 100000;
      } else if (unit == ' m') {
        numscale = numscale * 100;
      }

      var dem = numscale / distancecarte;

      return dem;
    }

    var extents = this.map?.getView().calculateExtent(this.map.getSize());
    var center = getCenterOfExtent(extents);
    var WGS84 = transform([center[0], center[1]], 'EPSG:3857', 'EPSG:4326');

    var label = 'JPEG';
    var type = 'base64';
    var format = 'JPEG';

    var images = {
      png0: url,

      png1: 'data:image/png;base64,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',
    };

    this.printService.createPDFObject(
      images,
      label + ' ' + type,
      format,
      'none',
      WGS84,
      getmetricscal(),
      this.titre,
      this.description
    );

    this.titre = '';
    this.description = '';
  }
}
