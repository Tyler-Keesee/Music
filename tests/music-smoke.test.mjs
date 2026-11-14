import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root = path.resolve(import.meta.dirname,'..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');

test('all inline app scripts and worker parse as JavaScript', () => {
  const html = read('index.html');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length,1);
  for (const script of scripts) new vm.Script(script[1], {filename:'index.html'});
  new vm.Script(read('service-worker.js'), {filename:'service-worker.js'});
});
test('player has imported media controls and no stale account paths', () => {
  const html=read('index.html');
  for(const id of ['mediaPlayer','add-media','song-list-items','volume-slider','play-btn','pause-btn']) {
    assert.match(html, new RegExp('id="' + id + '"'));
  }
  assert.doesNotMatch(html, /scope:\s*'\/Music\/'|src=\s*['"]\/music\//);
  assert.match(html, /indexedDB\.open\('offline-music-media'/);
});
test('worker safely caches the shell but never preloads unsupported audio files', () => {
  const sw=read('service-worker.js');
  assert.match(sw,/new URL\('index.html', SCOPE\)/);
  assert.match(sw,/request\.headers\.has\('range'\)/);
  assert.doesNotMatch(sw,/cachedMusicFiles|musicFiles\.map|status:\s*206/);
});
test('manifest paths and assets are local and valid', () => {
  const manifest=JSON.parse(read('manifest.json'));
  assert.equal(manifest.scope,'./');
  assert.equal(manifest.start_url,'./index.html');
  for (const icon of manifest.icons) {
    assert.ok(icon.src.startsWith('./'));
    assert.ok(fs.statSync(path.join(root,icon.src)).size > 0);
  }
});
