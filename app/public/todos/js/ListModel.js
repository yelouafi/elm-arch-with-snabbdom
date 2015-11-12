
export default function ListModel(model) {
  return {
    init() {
      return { nextID: 1, items: []};
    },

    add({nextID, items}) {
      return {
        nextID: nextID+1,
        items: [...items, {id: nextID, data: model.init()}]
      };
    },

    update({nextID, items}, id, action, ...args) {
      return {
        nextID,
        items: items.map(it => it.id !== id ? it : {id, data: action(it.data, ...args)})
      };
    }
  }

}
