package com.altruist.utils;


/**
 * Generic name value class used for comparison
 * @author Pavnesh
 *
 * @param <T> Type of property value
 */

public class ComparableNameValue <T> extends NameValue<T> 
{

	 /**
     * Enumeration indicating comparisons possible
     */
    public enum Comparison 
    {
        /** Comparison operator for exact match */
        Equal,
        /** Comparison operator for similar matches */
        Like,
        /** Comparison operator for greator than matches */
        GreatorThan,
        /** Comparison operator for less than matches */
        LessThan,
        /** Comparison operator for greator than equal to matches */
        GreatorThanEqual,
        /** Comparison operator for less than equal to matches */
        LessThanEqual,
        
        /** Comparison operator for less than equal to matches */
        NotEqual
        
    }

    /** Comparison operator to be used */
    private Comparison comparisonOperator;

	/**
	 * Constructor to initialize with name, propery and comparison
	 * @param propertyName
	 * @param propertyValue
	 */
	public ComparableNameValue(final String propertyName, final T propertyValue, final Comparison comparison) 
	{
		super(propertyName, propertyValue);
		this.comparisonOperator = comparison;
	}

	
	/**
     * Get comparison operator for this instance
     * @return {@link Comparison}
     */
    public final Comparison getComparisonOperator() 
    {
        return this.comparisonOperator;
    }
}
