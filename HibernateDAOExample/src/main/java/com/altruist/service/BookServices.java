package com.altruist.service;

import java.util.List;

import com.altruist.dao.BookDao;
import com.altruist.entity.Book;


/*****************************************************************************
This is the service class which uses the DAO class methods to update, delete,
retrieve, findall, find etc from or into the database table.
*****************************************************************************/
public class BookServices 
{
	private static BookDao bookdao;
	
	public BookServices()
	{
		bookdao=new BookDao();
	}
	
/*****************************************************************************
persist() method is used to store the data into the table by first opening the
session and begin the transaction then storing the data and then commiting the 
transaction and then closing the session.
*****************************************************************************/
	
	public void persist(Book entity)
	{
		try
		{
			bookdao.openCurrentSessionwithTransation();
			bookdao.persist(entity);
			bookdao.closeSessionwithTransaction();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
/*****************************************************************************
update() method is used to update the data into the table by first opening the
session and begin the transaction then updating the data and then commiting the 
transaction and then closing the session.
*****************************************************************************/	
	
	public void update(Book entity)
	{
		try
		{
			bookdao.openCurrentSessionwithTransation();
			bookdao.update(entity);
			bookdao.closeSessionwithTransaction();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
/*****************************************************************************
findById() method is used to retrieve the data from the table using the id by 
first opening the session then retrieving the data and then closing the 
session.
*****************************************************************************/	
	
	public Book finById(String id)
	{
		Book book=new Book();
		try
		{
			bookdao.openCurrentSession();
			book=bookdao.findById(id);
			bookdao.closeCurrentSession();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return book;
	}
	
/*****************************************************************************
delete() method is used to delete the data from the table by first opening the
session and begin the transaction then deleting the data and then commiting 
the transaction and then closing the session.
*****************************************************************************/	
	
	public void delete(String id)
	{
		try
		{
			bookdao.openCurrentSessionwithTransation();
			Book book=bookdao.findById(id);
			bookdao.delete(book);
			bookdao.closeSessionwithTransaction();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
/*****************************************************************************
findAll() method is used to retrieve all the data from the table into a list 
by first opening the session then retrieving the data and then closing the 
session.
*****************************************************************************/
	
	public List<Book> findAll()
	{
		List<Book> booklist= null;
		try
		{
			bookdao.openCurrentSession();
		    booklist=bookdao.findAll();
			bookdao.closeCurrentSession();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return booklist;
	}
	
/*****************************************************************************
deleteAll() method is used to delete the data from the table by first opening 
the session and begin the transaction then deleting the data and then commiting 
the transaction and then closing the session.
*****************************************************************************/
	
	public void deleteAll()
	{
		try
		{
			bookdao.openCurrentSessionwithTransation();
			bookdao.deleteAll();
			bookdao.closeSessionwithTransaction();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
}
