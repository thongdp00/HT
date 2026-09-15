package com.httv.tv.ui

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.httv.tv.databinding.ItemCategoryBinding
import com.httv.tv.model.Category

class CategoryAdapter(
    private val onCategoryClick: (Category) -> Unit
) : RecyclerView.Adapter<CategoryAdapter.CategoryViewHolder>() {

    private val categories = mutableListOf<Category>()
    private var selectedIndex = 0

    fun submitList(newCategories: List<Category>) {
        categories.clear()
        categories.addAll(newCategories)
        notifyDataSetChanged()
    }

    fun setSelectedCategory(index: Int) {
        if (index in categories.indices) {
            val oldIndex = selectedIndex
            selectedIndex = index
            notifyItemChanged(oldIndex)
            notifyItemChanged(selectedIndex)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CategoryViewHolder {
        val binding = ItemCategoryBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return CategoryViewHolder(binding)
    }

    override fun onBindViewHolder(holder: CategoryViewHolder, position: Int) {
        val category = categories[position]
        holder.binding.tvCategoryName.text = category.name
        holder.binding.tvCategoryName.isSelected = (position == selectedIndex)

        holder.itemView.setOnClickListener {
            val prev = selectedIndex
            selectedIndex = holder.bindingAdapterPosition
            notifyItemChanged(prev)
            notifyItemChanged(selectedIndex)
            onCategoryClick(category)
        }
    }

    override fun getItemCount(): Int = categories.size

    class CategoryViewHolder(val binding: ItemCategoryBinding) : RecyclerView.ViewHolder(binding.root)
}
