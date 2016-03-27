package com.altruist.db.daoimpl;

import java.lang.reflect.ParameterizedType;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

import com.altruist.db.dao.BaseDao;
import com.altruist.hibernate.HibernateSessionFactory;
import com.altruist.utils.ComparableNameValue;
import com.altruist.utils.ComparableNameValue.Comparison;

/**
 * DB DAO implementation class for common DAO methods.
 * @param <T> is type of entity being persisted.
 * 
 */

public class BaseDaoImpl <T> implements BaseDao<T>
{
	/**
	 * Runtime type of T
	 */
	private Class<?> typeOfT;
	
	
	/**
	 * Constructor for initializing type of template class
	 */
	public BaseDaoImpl() 
	{
		typeOfT = (Class<?>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
	}
	
	/**
	 * Save method persist the T type entity
	 */

	
	public void save(T entity)
 {
		Session session = null;
		Transaction transaction= null;
		try
		{
			session = HibernateSessionFactory.getSessionFactory().openSession();
			transaction = session.beginTransaction();
			session.saveOrUpdate(entity);
			transaction.commit();
			session.flush();
			session.clear();
			session.close();			
		}
		catch(Exception e)
		{
			e.printStackTrace();
			
		}
	}

	/**
     * Find an entity be specific properties
     * @return entity if found any else 
     * @return null
     */

	
	public final T findEntity(ComparableNameValue<?>... properties) 
	{		
		Session session=null;
		try
		{
			session=HibernateSessionFactory.getSessionFactory().openSession();
			
			@SuppressWarnings("unchecked")
			final T result=(T) session.createCriteria(typeOfT).add(getCriterion(properties)).uniqueResult();
			session.clear();
			session.close();			
			return result;
		}
		catch(Exception e)
		{
			
			e.printStackTrace();
		}
		
		return null;
	}
		
	public void delete(T entity) 
	{		
		Session session = null;
		Transaction transaction = null;
		try
		{
			session = HibernateSessionFactory.getSessionFactory().openSession();
			transaction = session.beginTransaction();
			session.delete(entity);
			transaction.commit();
			session.flush();
			session.clear();
			session.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
			
		}
	}

	public final List<T> findAll(ComparableNameValue<?>... properties) 
	{		 
		Session session=null;
		try
		{
			session=HibernateSessionFactory.getSessionFactory().openSession();
			@SuppressWarnings("unchecked")
			List <T> listofT =  session.createCriteria(typeOfT).add(getCriterion(properties)).list();			
			session.clear();
			session.close();			
			return listofT;
		}
		catch(Exception e)
		{
			e.printStackTrace();
			
		}
		return null;
	}
	
	/**
	 * Update entity in the databse
	 * @param entity is type of entity being persisted
	 * @return true/false based upon the entity is updated or not.
	 * @throws EGException if there is any problem
	 **/
	
	public void update(T entity) 	
	{
		Session session = null;
		Transaction transaction = null;
		try {
			session = HibernateSessionFactory.getSessionFactory().openSession();
			transaction = session.beginTransaction();
			session.update(entity);
			transaction.commit();
			session.flush();
			session.clear();
			session.close();

		} 
		catch (Exception e) 
		{
			
		}
	}
	
	
	/**
	 * Get the criteria
	 * @param properties
	 * @return criteria
	 */
    private Criterion getCriterion(final ComparableNameValue<?>... properties) 
    {
        Criterion finalCriterion = null;
        for (ComparableNameValue<?> prop : properties) 
        {
            Criterion propertyCriterion = null;
            if (prop.getComparisonOperator() == Comparison.Equal)
            {
            	propertyCriterion = Restrictions.eq(prop.getName(), prop.getValue());
            }
            else if (prop.getComparisonOperator() == Comparison.GreatorThan)
            {
                propertyCriterion = Restrictions.gt(prop.getName(), prop.getValue());
            }
            else if (prop.getComparisonOperator() == Comparison.LessThan)
            {
                propertyCriterion = Restrictions.lt(prop.getName(), prop.getValue());
            }
            else if (prop.getComparisonOperator() == Comparison.GreatorThanEqual)
            {
                propertyCriterion = Restrictions.ge(prop.getName(), prop.getValue());
            }
            else if (prop.getComparisonOperator() == Comparison.LessThanEqual)
            {
                propertyCriterion = Restrictions.le(prop.getName(), prop.getValue());
            }
            else if (prop.getComparisonOperator() == Comparison.NotEqual)
            {
                propertyCriterion = Restrictions.ne(prop.getName(), prop.getValue());
            }
            else
            {
            	propertyCriterion = Restrictions.like(prop.getName(), prop.getValue());
            }

            if (finalCriterion == null)
            {
            	finalCriterion = propertyCriterion;
            }
            else
            {
            	finalCriterion = Restrictions.and(finalCriterion, propertyCriterion);
            }
        }
        return finalCriterion;
    }	
}
