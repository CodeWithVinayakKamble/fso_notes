# The 4-Step Creation Contract:

## Whenever a new Child is created:

* ### Assign parent: parent._id inside the new Child.

* ### Save the Child to the database: const savedChild = await newChild.save().

* ### Push the new ID into the Parent's array: parent.children = parent.children.concat(savedChild._id).

* ### Save the Parent to update its array: await parent.save().

--- 

## Projection (Field Filtering):

### By default, .populate() brings in the entire referenced document. If the document has private or heavy fields, you whitelist only what you want:

```js
.populate('fieldName', { field1: 1, field2: 1 })
// 1 = include this field (whitelist)
```

--- 

## Two-way linking keeps IDs synced between documents in the database; .populate() swaps those IDs for real JavaScript objects right before sending the data to the client.
