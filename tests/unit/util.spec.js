import {
  getSize,
} from '@/util';

import {
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from 'three';

test('getSize', () => {
  const object = new Mesh(new BoxGeometry(10, 20, 30), new MeshBasicMaterial());

  expect(getSize(object)).toEqual({ x: 10, y: 20, z: 30 });
});
