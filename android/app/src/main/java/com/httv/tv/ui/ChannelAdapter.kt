package com.httv.tv.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import coil.load
import com.httv.tv.databinding.ItemChannelBinding
import com.httv.tv.model.Channel

class ChannelAdapter(
    private val onChannelClick: (Channel) -> Unit
) : RecyclerView.Adapter<ChannelAdapter.ChannelViewHolder>() {

    private val channels = mutableListOf<Channel>()
    private var activeChannelId: String? = null

    fun submitList(newChannels: List<Channel>) {
        channels.clear()
        channels.addAll(newChannels)
        notifyDataSetChanged()
    }

    fun setActiveChannel(channel: Channel) {
        val oldIndex = channels.indexOfFirst { it.id == activeChannelId }
        activeChannelId = channel.id
        val newIndex = channels.indexOfFirst { it.id == activeChannelId }

        if (oldIndex != -1) notifyItemChanged(oldIndex)
        if (newIndex != -1) notifyItemChanged(newIndex)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ChannelViewHolder {
        val binding = ItemChannelBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ChannelViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ChannelViewHolder, position: Int) {
        val channel = channels[position]
        val isCurrentActive = channel.id == activeChannelId

        holder.binding.tvItemNumber.text = String.format("%02d", channel.channelNumber)
        holder.binding.tvItemName.text = channel.cleanName.ifEmpty { channel.name }

        // Load channel logo with fallback
        if (channel.logo.isNotEmpty()) {
            holder.binding.ivItemLogo.visibility = View.VISIBLE
            holder.binding.ivItemLogo.load(channel.logo) {
                crossfade(true)
            }
        } else {
            holder.binding.ivItemLogo.visibility = View.GONE
        }

        // Active playing status badge
        holder.binding.tvActiveBadge.visibility = if (isCurrentActive) View.VISIBLE else View.GONE
        holder.itemView.isSelected = isCurrentActive

        holder.itemView.setOnClickListener {
            onChannelClick(channel)
        }
    }

    override fun getItemCount(): Int = channels.size

    class ChannelViewHolder(val binding: ItemChannelBinding) : RecyclerView.ViewHolder(binding.root)
}
