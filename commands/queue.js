const sounds = require('../kitten-sounds.js')
const {
  EmbedBuilder,
  SlashCommandBuilder
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Display the current playlist.'),

  async execute(interaction) {
    // Get queue
    const client = interaction.client
    const queue = client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) {
      return interaction.reply({
        content: `${sounds.confused()} :mute:`,
        ephemeral: true
      }).catch(e => { console.log(e) })
    }

    // Return if no music
    if (!queue.tracks[0]) {
      return interaction.reply({
        content: `${sounds.no()} :zero:`,
        ephemeral: true
      }).catch(e => { console.log(e) })
    }

    // Create embed
    const tracks = queue.tracks.map(
      (track, i) => `**${i + 1}** - ${track.title} | ${track.author}`
    )
    const n = queue.tracks.length
    const nextSongs = n > 5 ? `+ **${n - 5}**` : `**${n}**`
    const embed = new EmbedBuilder()
      .setColor(client.config.color)
      .setThumbnail(queue.current.thumbnail)
      .setTitle('Playlist')
      .setDescription(
        `Currently Playing: \`${queue.current.title}\`\n
        ${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`
      )
      .setTimestamp()

    // Reply
    interaction.reply({ embeds: [embed] })
      .catch(e => { console.log(e) })
  }
}
