def linear_search_product(product_list, target_product):
    indices = []
    
    # Iterate through the list of products and check for the target product
    for index, product in enumerate(product_list):
        if product == target_product:
            indices.append(index)
    
    return indices
products = ["apple", "banana", "apple", "cherry", "apple", "date"]
target = "apple"
result = linear_search_product(products, target)
print(result)  # Output: [0, 2, 4]