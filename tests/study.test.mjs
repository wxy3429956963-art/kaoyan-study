import test from 'node:test';
import assert from 'node:assert/strict';
import { dayNumber, remainingDays, defaultTasks, validDate } from '../src/study.mjs';
test('71 day calendar respects UTC day boundaries',()=>{
 assert.equal(remainingDays('2026-10-09','2026-12-19'),71);
 assert.equal(dayNumber('2026-10-09','2026-10-09'),1);
 assert.equal(dayNumber('2026-10-09','2026-10-19'),11);
 assert.equal(remainingDays('2026-12-20','2026-12-19'),0);
});
test('calendar rejects impossible dates',()=>{
 assert.equal(validDate('2026-02-30'),false);
 assert.equal(validDate('2026-02-28'),true);
});
test('daily tasks are deterministic and change with study phase',()=>{
 const initial=defaultTasks('2026-10-09','2026-10-09');
 assert.equal(initial.length,4);
 assert.ok(initial.every(t=>!t.done));
 assert.deepEqual(initial,defaultTasks('2026-10-09','2026-10-09'));
 assert.notEqual(initial[2].title,defaultTasks('2026-10-09','2026-10-25')[2].title);
 assert.notEqual(initial[0].id,defaultTasks('2026-10-09','2026-10-10')[0].id);
});

