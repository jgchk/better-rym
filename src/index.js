// ==UserScript==
// @name        betterRYM
// @description various improvements for rateyourmusic.com
// @author      mocha
// @version     2.2.1
// @license     MIT
// @match       *://rateyourmusic.com/release/*
// @match       *://rateyourmusic.com/callback/*
// @connect     self
// @connect     spotify.com
// @connect     *
// @grant       GM.xmlHttpRequest
// @grant       GM.openInTab
// @grant       GM_notification
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @grant       window.close
// ==/UserScript==

import $ from 'jquery'


