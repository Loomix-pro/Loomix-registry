import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"
import { getTranslations } from "next-intl/server"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@/modules/common/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = async ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const t = await getTranslations("Cart")

  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-2xl small:text-[2rem] leading-8 small:leading-[2.75rem]">
          {t("title")}
        </Heading>
      </div>
      <Table className="bg-transparent">
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0 text-left">
              {t("item")}
            </Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell className="text-center">
              {t("quantity")}
            </Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell text-center">
              {t("price")}
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-center">
              {t("total")}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={cart?.currency_code}
                  />
                )
              })
            : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
