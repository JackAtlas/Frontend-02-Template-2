import assert from 'assert'
import { parseHTML } from '../src/parser'

describe('parse html:', function () {
  it('<a></a>', function () {
    let tree = parseHTML('<a></a>')
    assert.strictEqual(tree.children[0].tagName, 'a')
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a href="abc"></a>', function () {
    let tree = parseHTML('<a href="abc"></a>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a href', function () {
    let tree = parseHTML('<a href></a>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a href id></a>', function () {
    let tree = parseHTML('<a href id></a>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a href="abc" id></a>', function () {
    let tree = parseHTML('<a href="abc" id></a>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a id=abc></a>', function () {
    let tree = parseHTML('<a id=abc></a>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a id=abc/>', function () {
    let tree = parseHTML('<a id=abc/>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a id=\'abc\'></a>', function () {
    let tree = parseHTML('<a id=\'abc\'></a>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a />', function () {
    let tree = parseHTML('<a />')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<A /> uppercase', function () {
    let tree = parseHTML('<A />')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<>', function () {
    let tree = parseHTML('<>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].type, 'text')
  })
})