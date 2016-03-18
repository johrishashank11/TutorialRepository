package com.altruist.dao;

import java.io.Serializable;
import java.util.List;

/**********************************************************************
This is an interface which contains the method structures which will
be used by the srvice class to create the method with the same name.
**********************************************************************/

public interface BookDaoInterface<T,Id extends Serializable> 
{
	public void persist(T entity);
	
	public void update(T entity);
	
	public T findById(Id id);
	
	public void delete(T entity);
	
	public List<T> findAll();
	
	public void deleteAll();
}
