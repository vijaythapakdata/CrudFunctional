import * as React from 'react';
// import styles from './CrudOperation.module.scss';
import type { ICrudOperationProps } from './ICrudOperationProps';
import {getSP,SPFI} from '../pnpConfig';
import { DefaultButton, DetailsList, Dialog, DialogFooter, DialogType, Icon, IconButton, PrimaryButton, SelectionMode, TextField } from '@fluentui/react';
//type defination
interface IQuotesRes{
  Title:string;
  Author:string;
  Id:number;
}
interface IQuotesState{
  quote:string;
 author:string;
 id:number
}
const CrudOperation =(props:ICrudOperationProps):React.ReactElement=>{
  const _sp:SPFI=getSP(props.context);
  const [reload,setReload]=React.useState<boolean>(false);
  const[quotes,setQuotes]=React.useState<Array<IQuotesState>>([]);
  const [currentId,setCurrentId]=React.useState<number|any>();
  const [isEditHidden,setIsEditHidden]=React.useState<boolean>(true);
  const [editQuote,setEditQuote]=React.useState<string>('');
  const [editedAuthor,seteditAuthor]=React.useState<string>('');
  const [isAddHidden,setIAddHidden]=React.useState<boolean>(true);
  const [newQuote,setNewQuote]=React.useState<string>('');
  const [newAuthor,setNewAuthor]=React.useState<string>('');

  //use effect
  React.useEffect(()=>{
    getListItems();
  },[reload])
//reading the data
  const getListItems=async()=>{
    try{
      const getListItems=await _sp.web.lists.getbytitle('Quotes').items();
      //setting the list item to state 
      setQuotes(getListItems.map((each:IQuotesRes)=>({
        quote:each.Title,
        author:each.Author,
        id:each.Id
      })))
    }
    catch(error){
      console.log(error);
    }
    finally{
      console.log('List item fetched',quotes);
    }
  }
const handleQuote=(event:React.ChangeEvent<HTMLInputElement>)=>{
  setNewQuote(event.target.value);
}
const handleAuthor=(event:React.ChangeEvent<HTMLInputElement>)=>{
  setNewAuthor(event.target.value);
}
const addNewListItem=async()=>{
  const list=_sp.web.lists.getbytitle('Quotes');
  try{
    await list.items.add({
      Title:newQuote,
      Author:newAuthor
    });
    //close the add model
    setIAddHidden(true);
    //rest
    setReload(!reload);
    console.log('List item is added');
  }
  catch(e){
    console.log(e);
  
  }
  finally{
    setIAddHidden(true);
  }
}

//open Dialog
const openEditDialog=(id:number)=>{
  setCurrentId(id);
  //this function would open
  setIsEditHidden(false);
  const quote:IQuotesState|undefined=quotes.find((each:any)=>each.id===id);
  if(quote){
    setNewAuthor(quote.author);
    setEditQuote(quote.quote);
  }
}
const handleQuoteChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
  setEditQuote(event.target.value);
}
const handleAuthorChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
  seteditAuthor(event.target.value);
}
//Edit Item
const editListItem=async()=>{
  //get list
  const List=_sp.web.lists.getbytitle('Quotes');
  try{
    await List.items.getById(currentId).update({
Title:editQuote,
Author:editedAuthor
    });
    setIsEditHidden(true);
    setReload(!reload);
    console.log('List item is updated');
  }
  catch(err){
    console.log(err);
  }
  finally{
    setIsEditHidden(true);
  }
}
//delte item
const deleteListItem=async(id:number)=>{
  const list=_sp.web.lists.getbytitle('Quotes');
  try{
    await list.items.getById(id).delete();
    setReload(!reload);
    console.log('List item is deleted');
  }
  catch(err){
    console.log(err);
  }
}
return(
  <>
  <h1>Editable Table in the Spfx</h1>
  <div className='quotebox'>
    <h2>Quotes</h2>
    <div className='container'>
      <DetailsList
      items={quotes||[]}
      columns={[
        {
          key:'quoteColumn',
          name:'Quote',
          fieldName:'quote',
          minWidth:200,
          isResizable:true,
          onRender:(item:IQuotesState)=><div>{item.quote}</div>
        },
        {
          key:'authorColumn',
          name:'Author',
          fieldName:'author',
          minWidth:200,
          isResizable:true,
          onRender:(item:IQuotesState)=><div>{item.author}</div>
        },
        {
          key:'actionColumn',
          name:'Actions',
          minWidth:200,
          isResizable:true,
          onRender:(item:IQuotesState)=>(
            <div>
              <IconButton iconProps={{iconName:'edit'}}
              
              onClick={()=>openEditDialog(item.id)}
              title='Edit'
              aria-label='Edit'/>
              <IconButton iconProps={{iconName:'delete'}}
              onClick={()=>deleteListItem(item.id)}
              title='Delete'
              aria-label='Delete'
              />
                
           </div>
          )
        }
      ]}
      selectionMode={SelectionMode.none}
      />
      <Dialog hidden={isEditHidden}
      onDismiss={()=>setIsEditHidden(true)}
      dialogContentProps={{
        type:DialogType.normal,
        title:'Edit Quote',
      }}
      >
<div>
  <TextField label='Quote'
  value={editQuote}
  onChange={handleQuoteChange}
  />
    <TextField label='Author'
  // value={editQuote}
  value={editedAuthor}
  onChange={handleQuoteChange}
  />
</div>
<DialogFooter >
  <PrimaryButton text="Submit" onClick={()=>editListItem()}/>
    <DefaultButton text="Cancel" onClick={()=>setIsEditHidden(true)}/>

</DialogFooter>
      </Dialog>

    </div>
  </div>
  <div>
    <PrimaryButton text ='Add New Quote' onClick={()=>setIAddHidden(false)}/>
  </div>
  <Dialog hidden={isAddHidden}
    onDismiss={()=>setIAddHidden(true)}
    dialogContentProps={{
      type:DialogType.normal,
      title:'Add New Quote'
    }}
    >
      <div>
      <TextField label='Quote'
  value={newQuote
  }
  onChange={handleQuote}
  />
      <TextField label='Author'
  value={newAuthor
  }
  onChange={handleAuthor}
  />
      </div>
      <DialogFooter>
      <PrimaryButton text="Submit" onClick={()=>addNewListItem()}/>
      <DefaultButton text="Cancel" onClick={()=>setIAddHidden(true)}/>
      </DialogFooter>
  </Dialog>
  </>
)
}
export default CrudOperation;