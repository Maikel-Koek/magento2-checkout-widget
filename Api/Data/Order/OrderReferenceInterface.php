<?php
/**
 * Copyright © 2019 Paazl. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Paazl\CheckoutWidget\Api\Data\Order;

/**
 * Interface OrderReferenceInterface
 * Declaration of the Paazl reference to the order
 *
 * @package Paazl\CheckoutWidget\Api\Data\Order
 */
interface OrderReferenceInterface
{
    /**#@+
     * Indexes of fields
     *
     * @var string
     */
    const ENTITY_ID = 'entity_id';
    const ORDER_ID = 'order_id';
    const EXT_SHIPPING_INFO = 'ext_shipping_info';
    const EXT_SENT_AT = 'ext_sent_at';
    /**#@-*/

    /**
     * @param int $value
     *
     * @return $this
     */
    public function setOrderId($value);

    /**
     * @return int
     */
    public function getOrderId();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setExtShippingInfo($value);

    /**
     * @return string
     */
    public function getExtShippingInfo();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setExtSentAt($value);

    /**
     * @return string
     */
    public function getExtSentAt();

    /**
     * @return bool
     */
    public function isSent();
}