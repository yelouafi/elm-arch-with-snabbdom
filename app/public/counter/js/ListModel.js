
export default function ListModel(model) {
  return {
    init() {
      return { nextID: 1, items: []};
    },

    addItem({nextID, items}) {
      return {
        nextID: nextID+1,
        items: [...items, {id: nextID, data: model.init()}]
      };
    },

    updateItem({nextID, items}, id, action) {
      return {
        nextID,
        items: items.map(it => it.id !== id ? it : {id, data: model.update(it.data, action)})
      };
    }

    removeItem({nextID, items}, id) {
      return {
        nextID,
        items: items.filter(it => it.id !== id)
      };
    }
  }

}
