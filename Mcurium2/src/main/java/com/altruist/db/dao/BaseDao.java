package com.altruist.db.dao;

import java.util.List;

import com.altruist.utils.ComparableNameValue;

/**
 * 
 * @author Pavnesh
 * 
 * @param <T>
 *            is the entity to be persisted, deleted or updated
 */

public interface BaseDao<T> 
{

	void save(T entity) ;

	T findEntity(ComparableNameValue<?>... properties);

	List<T> findAll(ComparableNameValue<?>... properties);

	void delete(T entity) ;

	void update(T entity) ;
	
}
