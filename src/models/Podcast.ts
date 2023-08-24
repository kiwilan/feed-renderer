import { component } from '../renderers'
import { Episode } from './Episode'
import type { Channel } from '~/types'

export class Podcast {
  protected constructor(
    protected title?: string,
    protected description?: string,
    protected image?: {
      url?: string
      title?: string
      link?: string
    },
    protected link?: string,
    protected rss?: string,
    protected language?: string,
    protected copyright?: string,
    protected lastBuildDate?: string,
    protected pubDate?: string,
    protected guid?: string,
    protected categories?: string[],
    protected itunesCategories?: {
      category?: string
      subCategory?: string
    }[],
    protected episodes?: Episode[],
  ) {}

  public static make(channel: Channel): Podcast {
    const self = new this()
    self.title = channel.title
    self.description = channel.description
    self.image = channel.image
    self.link = channel.link
    self.rss = channel['atom:link']?.['@_href']
    self.language = channel.language
    self.copyright = channel.copyright
    self.lastBuildDate = channel.lastBuildDate
    self.pubDate = channel.pubDate
    self.guid = channel.guid
    self.categories = channel.category

    self.itunesCategories = []
    channel['itunes:category']?.forEach((category) => {
      self.itunesCategories?.push({
        category: category['@_text'],
        subCategory: category['itunes:category']?.['@_text'],
      })
    })

    self.episodes = []
    channel.item?.forEach((item) => {
      self.episodes?.push(Episode.make(item))
    })

    return self
  }

  public getTitle(): string | undefined {
    return this.title
  }

  public getDescription(): string | undefined {
    return this.description
  }

  public getImage(): {
    url?: string
    title?: string
    link?: string
  } | undefined {
    return this.image
  }

  public getLink(): string | undefined {
    return this.link
  }

  public getRss(): string | undefined {
    return this.rss
  }

  public getLanguage(): string | undefined {
    return this.language
  }

  public getCopyright(): string | undefined {
    return this.copyright
  }

  public getLastBuildDate(): string | undefined {
    return this.lastBuildDate
  }

  public getPubDate(): string | undefined {
    return this.pubDate
  }

  public getGuid(): string | undefined {
    return this.guid
  }

  public getCategories(): string[] | undefined {
    return this.categories
  }

  public getItunesCategories(): {
    category?: string
    subCategory?: string
  }[] | undefined {
    return this.itunesCategories
  }

  public getEpisodes(): Episode[] {
    return this.episodes || []
  }

  public getEpisode(index: number): Episode | undefined {
    return this.episodes?.[index]
  }

  // public render(): any {
  //   // return renderToString(PodcastRenderer({
  //   //   podcast: this,
  //   // }))

  //   return renderToString(Counter())
  // }

  public async render() {
    const react = await component()
    console.log(react)

    return '<div>component</div>'

    // return renderToString(PodcastRenderer({
    //   podcast: this,
    // }))
  }

  public toArray(): Record<string, any> {
    return {
      title: this.title,
      description: this.description,
      image: this.image?.url,
      link: this.link,
      rss: this.rss,
      language: this.language,
      copyright: this.copyright,
      lastBuildDate: this.lastBuildDate,
      pubDate: this.pubDate,
      guid: this.guid,
      categories: this.categories?.join(', '),
      itunesCategories: this.itunesCategories?.map((category) => {
        return `${category.category} > ${category.subCategory}`
      }).join(', '),
      episodes: this.episodes?.map((episode) => {
        return episode.toArray()
      }),
    }
  }
}
