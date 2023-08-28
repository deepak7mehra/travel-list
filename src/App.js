import { useState } from "react";



export default function APP(){
  const [items,setitems] = useState([]);
  

  function handleAddItem(item){
    setitems((items)=>[...items,item]);
  }

  function handleDeleteItem(id){
    setitems((items)=> items.filter(item=>item.id!==id));
  }
  
  function handleToggleItem(id){
    setitems((items)=>
      items.map((item)=>
      item.id === id ? {...item,packed:!item.packed}:item
      )
    );
  }

  
  return (<div className="app">
    <Logo/>
    <Form onAddItem = {handleAddItem} />
    <PackingList items={items} onDeleteItem = {handleDeleteItem} onToggleItem = {handleToggleItem} setitems={setitems} />
    <Stats items = {items} />
  </div>)
}


function Logo(){
  return <h1> 🌴 Far Away</h1>
}


function Form({onAddItem}) {

  const [description,setDescription] = useState("")
  const [quantity,setQuantity] = useState(0);



  function handleSubmit(e){
    e.preventDefault();

    if (!description) return;

    const newItem = {description,quantity,packed:false,id:Date.now()}
    console.log(newItem);

    onAddItem(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit} >
      <h3>What do you need for your trip</h3>
      <select onChange={(e)=> setQuantity(Number(e.target.value))} value={quantity} >
        {Array.from({length:20},(_,i)=>i+1).map
        ((num)=>(<option value={num} key={num}>{num}</option>))}
      </select>
      <input type="text" onChange={(e)=> setDescription(e.target.value)} value={description} placeholder="Item..."/>
      <button>Add</button>
    </form>
  )
}

function Item({item,onDeleteItem,onToggleItem}){
  return (
  <li>
    <input type="checkbox" onChange={()=>onToggleItem(item.id)} />
    <span style={item.packed ? {textDecoration:"line-through"}:{}} >
      {item.quantity} {item.description} 
    </span>
    <button onClick={()=>onDeleteItem(item.id)} >❌</button>
  </li>
  );
}

function PackingList({items, onDeleteItem, onToggleItem , setitems}) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;
  if (sortBy === "input") sortedItems = items;

  if (sortBy === 'description') sortedItems = items.slice().sort((a,b)=> a.description.localeCompare(b.description));

  if (sortBy === "packed") sortedItems = items.slice().sort((a,b) => Number(a.packed)-Number(b.packed))

  function handleClearList(){
    const confirmed = window.confirm("Are you sure you want to delete all items?");

    if(confirmed) setitems([]);
  }

  return(
  <div className="list">
    <ul>
      {sortedItems.map(item=>(<Item item={item} onDeleteItem={onDeleteItem} onToggleItem={onToggleItem}/>))}
    </ul>

    <div className="actions" > 
      <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
        <option value="input">sort by the input order</option>
        <option value="description">sort by description</option>
        <option value="packed">sorted by packed status</option>
      </select>
      <button onClick={handleClearList} > clear list </button>
    </div>

  </div>
  );
}

function Stats({items}) {
  if (!items.length){
    return(
      <p className="stats">
        <em> Start adding some items to your packing list</em>
      </p>
    )
  }


  const numItems = items.length;
  const numPacked = items.filter((item)=> item.packed).length;
  const percentage = Math.round((numPacked/numItems)*100)

  return(
    <footer className="stats">
      { percentage === 100 ? "You have packed everything! Ready to go ✈" : 
      `<em> you have ${numItems} items on your list , and you have packed ${numPacked} (${percentage}%)</em>`}
    </footer>
  )
}