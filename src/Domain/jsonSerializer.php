<?php

namespace SUN\Domain;

trait jsonSerializer {
	public function jsonSerialize()
	{
		return get_object_vars($this);
	}
}