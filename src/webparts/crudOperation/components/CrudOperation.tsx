import * as React from 'react';
// import styles from './CrudOperation.module.scss';
import type { ICrudOperationProps } from './ICrudOperationProps';
import {getSP,SPFI} from '../pnpConfig';
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
}
