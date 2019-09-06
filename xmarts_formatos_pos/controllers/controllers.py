# -*- coding: utf-8 -*-
from odoo import http

# class XmartsFormatosPos(http.Controller):
#     @http.route('/xmarts_formatos_pos/xmarts_formatos_pos/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/xmarts_formatos_pos/xmarts_formatos_pos/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('xmarts_formatos_pos.listing', {
#             'root': '/xmarts_formatos_pos/xmarts_formatos_pos',
#             'objects': http.request.env['xmarts_formatos_pos.xmarts_formatos_pos'].search([]),
#         })

#     @http.route('/xmarts_formatos_pos/xmarts_formatos_pos/objects/<model("xmarts_formatos_pos.xmarts_formatos_pos"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('xmarts_formatos_pos.object', {
#             'object': obj
#         })